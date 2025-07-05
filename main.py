import openai

# Set your OpenAI API key here
openai.api_key = "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"

# Function to call OpenAI API
def generate_text(prompt):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # You can choose another engine if needed
            prompt=prompt,
            max_tokens=100,  # Customize the number of tokens you want in the response
            temperature=0.7  # Controls randomness, lower = more focused
        )
        return response.choices[0].text.strip()  # Extract the generated text
    except Exception as e:
        return f"Error: {e}"

# Example usage
prompt = "Tell me a joke about programmers."
response = generate_text(prompt)
print(response)
