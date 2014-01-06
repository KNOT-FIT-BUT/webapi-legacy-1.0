#!/usr/bin/env python

# nutnost provest make souboru kb_loader_slow.cc (nutno odkomentovat
# v souboru Makefile)
import commands
import os
from ctypes import *
import ctypes

#@profile
def my_func():
	count = commands.getoutput('wc -l ../make_automat/KB.all | cut -d" " -f1')
	max = int(count)
	maxitem = 18

	lib = cdll.LoadLibrary('./kb_loader.so')
	lib.queryTree.restype = POINTER(POINTER(c_char_p))
	lib.queryTree.argtypes = [c_char_p,c_int,c_int]

	s = lib.queryTree("../make_automat/KB.all",max,maxitem);
	return s

def my_print(value):
	count = commands.getoutput('wc -l ../make_automat/KB.all | cut -d" " -f1')
	max = int(count)
	for x in range(0,max):
		for y in range(0,5): # toto je jen testovaci vypis
			print value[x][y] # pristupuje se k prvkum na mistech x a y

if __name__ == '__main__':
	value = my_func()
	my_print(value)
