import { useState } from "react";
import {
  Loader2,
  Send
} from "lucide-react";

const FoodInput = ({
  onSubmit,
  isSubmitting
}) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedInput = inputText.trim();

    if (!trimmedInput || isSubmitting) {
      return;
    }

    await onSubmit(trimmedInput);

    setInputText("");
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSubmit(event);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition focus-within:ring-2 focus-within:ring-emerald-500">

      <form
        onSubmit={handleSubmit}
        className="flex items-end bg-emerald-50/50 p-2"
      >

        <textarea
          value={inputText}
          onChange={(event) => {
            setInputText(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g., A bowl of oatmeal with blueberries and 2 eggs"
          rows={2}
          disabled={isSubmitting}
          className="min-h-15 max-h-30 w-full resize-none bg-transparent p-4 text-gray-800 outline-none placeholder:text-gray-500 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !inputText.trim()
          }
          className="m-2 shrink-0 rounded-xl bg-emerald-500 p-3 text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          title="Analyze food"
        >
          {isSubmitting ? (
            <Loader2
              size={20}
              className="animate-spin"
            />
          ) : (
            <Send size={20} />
          )}
        </button>

      </form>
    </div>
  );
};

export default FoodInput;