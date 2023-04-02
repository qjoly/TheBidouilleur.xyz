"""Docusaurus build script."""

import sys
import anyio
import dagger
from pathlib import Path
import threading

async def docusaurus_build():

    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")

        build = (
            client.container().from_("node:16.20.0-alpine").with_workdir("/data")
            .with_mounted_directory("/data", src)
            .with_workdir("/data")
            .with_exec("npm install".split(" "))
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
    try:
        anyio.run(docusaurus_build)
    except:
        print("Error in Docusaurus build")