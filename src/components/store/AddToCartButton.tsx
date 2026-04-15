"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/types/book";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  book: Book;
  /** Hide the label on small screens — shows icon only on mobile */
  compact?: boolean;
}

export default function AddToCartButton({
  book,
  compact,
  ...props
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(book);
    setAdded(true);
    toast({
      title: "Added to cart",
      description: `"${book.title}" by ${book.author}`,
    });
    setTimeout(() => setAdded(false), 1500);
  }

  const icon = added ? (
    <Check className={compact ? "h-4 w-4 sm:mr-1" : "h-4 w-4 mr-2"} />
  ) : (
    <ShoppingCart className={compact ? "h-4 w-4 sm:mr-1" : "h-4 w-4 mr-2"} />
  );

  const label = added ? "Added!" : "Add to Cart";

  return (
    <Button onClick={handleAdd} disabled={!book.isAvailable} {...props}>
      {icon}
      {compact ? (
        <span className="hidden sm:inline">{label}</span>
      ) : (
        label
      )}
    </Button>
  );
}
