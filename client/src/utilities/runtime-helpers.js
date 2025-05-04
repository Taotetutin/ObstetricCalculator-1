export function useHandleStreamResponse({ onChunk, onFinish }) {
  return async (response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        result += text;
        onChunk(result);
      }
      onFinish(result);
    } catch (error) {
      console.error("Error reading stream:", error);
      throw error;
    }
  };
}