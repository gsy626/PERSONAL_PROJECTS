CC = gcc
TARGET = gtk4-4
SRCS = gtk4-4.c
GTK_CFLAGS = $(shell pkg-config --cflags gtk4)
GTK_LIBS   = $(shell pkg-config --libs gtk4)
CFLAGS = -Wall -g $(GTK_CFLAGS)
LIBS = $(GTK_LIBS)
all: $(TARGET)
$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) $(SRCS) -o $(TARGET) $(LIBS)
.PHONY: all
