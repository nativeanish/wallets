Db = Db or {}
Handlers.add("add", Handlers.utils.hasMatchingTag("Action", "add"), function(msg)
    assert(msg.Tags.key ~= nil, "Key is nil")
    Db[msg.Tags.key] = ""
    Db[msg.Tags.key] = msg.From
    Handlers.utils.reply("Added")(msg)
end)
Handlers.add("get",Handlers.utils.hasMatchingTag("Action", "get"), function(msg)
    assert(msg.Tags.key ~= nil, "Key is nil")
    local value = Db[msg.Tags.key]
    Handlers.utils.reply(value)(msg)
end)