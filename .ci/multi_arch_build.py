"""Build docker image for multiple architectures"""

import sys
import anyio
import dagger
import os
import threading

async def docker_image_build():
  platforms = ["linux/amd64", "linux/arm64"]

  async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:

    src = client.host().directory(".")

    variants = []
    for platform in platforms:
      print(f"Building for {platform}")
      platform = dagger.Platform(platform)
      build = (
            client.container(platform=platform)
            .build(
                context = src,
                dockerfile = "Dockerfile",
                build_args=[
                    dagger.BuildArg("PKG_NAME", os.environ.get("PKG_NAME", "default-value"))
                    ]
            )
        )
      variants.append(build)
    
    await client.container().publish("qjoly/thebidouilleur:dagger", platform_variants=variants)
    print("All tasks have finished")

def run_test(event):
    """Build docker image"""
    try:
        anyio.run(docker_image_build)
    except:
        print("Error in thread: ", threading.current_thread().name)
        event.set()

if __name__ == "__main__":
    try:
      anyio.run(docker_image_build)
    except:
      print("Error in Docker image build")