main: main.c
	gcc main.c -o main

run: main
	./main

watch:
	find -name "*.c" -type f | entr -c make run
