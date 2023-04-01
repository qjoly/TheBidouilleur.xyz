"""Build docker image"""

import sys
import anyio
import dagger
import os
import threading

async def docker_image_build():
    variants = []

    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")
        
        blog = (
            client.container()
            .build(
                context = src,
                dockerfile = "Dockerfile",
                build_args=[
                    dagger.BuildArg("PKG_NAME", os.environ.get("PKG_NAME", "default-value"))
                    ]
            )
        )
        
        image = await blog.publish(address="ttl.sh/test_image:1h")

    print(f"Image is accessible at {image}")

def run_test(event):
    """Build docker image"""
    try:
        anyio.run(docker_image_build)
    except:
        print("Error in thread: ", threading.current_thread().name)
        event.set()

if __name__ == "__main__":
    anyio.run(docker_image_build)