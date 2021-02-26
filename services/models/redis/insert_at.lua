local pivot = redis.call("lindex", KEYS[1], ARGV[1])

if not pivot then
    redis.call("rpush", KEYS[1], ARGV[2])
else    
    redis.call("linsert", KEYS[1], "BEFORE", pivot, ARGV[2])
end