from markdown_lint import markdown_lint
import anyio

if __name__ == "__main__":
    anyio.run(markdown_lint)