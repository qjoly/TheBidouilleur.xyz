"""Docusaurus build script."""

import sys
import anyio
import dagger
from pathlib import Path
import threading

async def docusaurus_build():

    package_json_contents = Path("./package.json").read_text()
    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")

        build = (
            client.container().from_("node:alpine").with_workdir("/data")
            .with_new_file("package.json", package_json_contents)
            .with_exec("npm install".split(" "))
            .with_mounted_directory("/data", src)
            .with_exec("npm run build".split(" "))
        )

        await build.exit_code()

    print("Docusaurus builded - Tests succeeded!")

def run_test(event):
    try:
        anyio.run(docusaurus_build)
    except:
        print("Error in thread: ", threading.current_thread().name)
        event.set()

if __name__ == "__main__":
    anyio.run(docusaurus_build)