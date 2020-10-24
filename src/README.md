start server with:

python -m SimpleHTTPServer

Then in your browser go to

http://localhost:8000

think about caching at the gpu level. it might mess with things the same way that caching at the browser level would (for example if texture data is not getting refreshed etc.)

better with python 3 method:

python3 -m http.server 8000
http://localhost:8000/


maybe look into vsync with webgl

should request animation frame be at the beginning or the end of the loop?

git checkouts were reverted with this command:

(for 3 commits prior; you have to commit then after that; I recommend testing first with a simple commit with 1 line edited to make sure if works the way you think)

git revert --no-commit HEAD~3..
