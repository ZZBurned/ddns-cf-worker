#!/bin/env python3
# 获取本机公网IPv6并通过CFworker记录
#

import os
import subprocess
import urllib.request

def get_v6_popen() -> list:
	output = subprocess.Popen(['ip', 'a'], stdout=subprocess.PIPE).communicate()
	lines = output[0].decode().split('\n')
	ipv6addr = []
	for line in lines:
		if line.strip().startswith('inet6 2'):
			ip6begin = line.find('2')
			ip6end = line.find('/')
			ipv6addr.append(line[ip6begin:ip6end])
	return ipv6addr
# 通过字符串处理ip命令输出获取本机公网IPv6地址

def check_v6_change(ipv6addr: list, logfile:str) -> bool:
	if not os.path.exists(logfile):
		print('Init IPv6 Address')
		return True
	with open(logfile, 'r') as f:
		lines = f.read().strip().split('\n')
		if len(ipv6addr) != len(lines):
			print('More or Less Address')
			return True
		for i in range(len(lines)):
			if ipv6addr[i] != lines[i]:
				print('Get Diff Address')
				return True
	return False

def post_worker(ipv6addr: list, worker_config:dict) -> bool:
	url = worker_config["worker"] + worker_config["path"] + "?" + worker_config["host"] + "=" + '_n'.join(ipv6addr)
	req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0"})
	try:
		with urllib.request.urlopen(req) as response:
			if response.status == 201:
				return True
	except Exception as e:
		print(e)
	return False
# trigger the worker update ip database

def cache_v6addr(ipv6addr: list, logfile:str):
	with open(logfile, 'w') as f:
		f.write('\n'.join(ipv6addr))

if __name__ == '__main__':
	config = dict()
	config["log_file"] = "cache_v6.txt"
	worker_config = dict()
	worker_config["worker"] = "https://workername.username.workers.dev"
	worker_config["path"] = "/update"
	worker_config["host"] = "servertag"
	config["worker_config"] = worker_config
	ipv6s = get_v6_popen()
	if ipv6s and check_v6_change(ipv6s, config["log_file"]) and post_worker(ipv6s, worker_config):
		cache_v6addr(ipv6s, config["log_file"])
	# 缓存当前发送成功的ipv6地址
