import anthropic

client = anthropic.Anthropic(api_key="sk-ant-api03-ONwpwvHYhXczElvB-Zfrv33JLzsggHZJWs22wzB0q3I")

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=10,
    messages=[{"role": "user", "content": "Hi"}]
)
print("✅ API key works! Response:", message.content[0].text)