"""Run all Dagger script in parallel using threads."""
import sys

import markdown_lint 
import docusaurus_build 

multithreaded = False
if __name__ == "__main__":

    if multithreaded:
        import threading

        print("Running tests in parallel using threads")
        event = threading.Event()

        markdown_lint_test = threading.Thread(target=markdown_lint.run_test, args=(event,), name="markdown_lint_test")
        docusaurus_build_test = threading.Thread(target=docusaurus_build.run_test, args=(event,), name="docusaurus_build_test")

        markdown_lint_test.start()
        docusaurus_build_test.start()

        # Wait for all threads to finish
        for thread in threading.enumerate():
            if thread is threading.current_thread():
                continue
            thread.join()

        # Check if any thread raised an exception
        if event.is_set():
            print("An exception was raised in one of the threads")
            sys.exit(1)
        else:
            sys.exit(0)
            print("All threads finished without errors")
    else:
        import anyio
        print("Running tests in parallel using anyio")
        anyio.run(markdown_lint.markdown_lint)
        print("Markdown lint finished")  
        anyio.run(docusaurus_build.docusaurus_build)
        print("Docusaurus build finished")

