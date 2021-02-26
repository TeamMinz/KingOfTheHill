local userid = ARGV[1]

local elements = redis.call("LRANGE", KEYS[1], 0, -1) --Get all the elements in the queue

for index, element in ipairs(elements) do
    local challenger = cjson.decode(element)

    if challenger["userId"] == userid or challenger["opaqueUserId"] == userid then
        redis.call("LREM", KEYS[1], 1, element)  
        return element
    end
end

return nil