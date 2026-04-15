import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/store/AddToCartButton";
import type { Book } from "@/types/book";

const conditionColor: Record<Book["condition"], string> = {
  New: "bg-warm-olive text-white border-transparent",
  "Like New": "bg-warm-olive/80 text-white border-transparent",
  "Very Good": "bg-warm-olive/60 text-white border-transparent",
  Good: "bg-warm-brown/80 text-white border-transparent",
  Acceptable: "bg-warm-rose text-foreground border-transparent",
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      {/* Cover image — clickable */}
      <Link href={`/books/${book.id}`} className="block">
        {/* Portrait aspect ratio keeps covers properly proportioned at any card width */}
        <div className="relative aspect-[3/4] bg-warm-sand">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={`${book.title} cover`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <span className="font-serif text-sm text-muted-foreground text-center leading-relaxed">
                {book.title}
              </span>
            </div>
          )}
          <Badge
            className={`absolute top-2 right-2 text-[10px] ${conditionColor[book.condition]}`}
          >
            {book.condition}
          </Badge>
        </div>
      </Link>

      {/* Info + Add to Cart */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link href={`/books/${book.id}`} className="flex-1">
          <h3 className="font-heading text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
        {/* Price + button always pinned to bottom */}
        <div className="flex items-center justify-between pt-1 mt-auto border-t border-border/50">
          <p className="text-sm font-semibold text-primary">
            ${book.price.toFixed(2)}
          </p>
          <AddToCartButton
            book={book}
            size="sm"
            variant="outline"
            compact
            className="h-7 px-2 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
