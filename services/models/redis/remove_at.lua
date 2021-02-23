local challenger = redis.call("lindex", KEYS[1], ARGV[1])
redis.call("lset", KEYS[1], ARGV[1], "DELETED")
redis.call("lrem", KEYS[1], 1, "DELETED")
return challenger