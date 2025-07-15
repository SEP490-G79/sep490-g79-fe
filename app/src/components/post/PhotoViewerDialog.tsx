import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface PhotoViewerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    photos: string[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

export default function PhotoViewerDialog({
    open,
    onOpenChange,
    photos,
    currentIndex,
    setCurrentIndex,
}: PhotoViewerDialogProps) {
    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % photos.length);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
    };

    // Thoát bằng phím ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        if (open) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, currentIndex]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="p-0 bg-black flex items-center justify-center"
                style={{
                    width: "100vw",
                    height: "100vh",
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    margin: 0,
                }}
            >
                <img
                    src={photos[currentIndex]}
                    alt={`Photo ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                />

                {/* Điều hướng */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-5 text-white hover:text-gray-300 z-10"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-5 text-white hover:text-gray-300 z-10"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    </>
                )}

                {/* Đếm ảnh */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1    -full text-sm z-10">
                    {currentIndex + 1} / {photos.length}
                </div>
            </DialogContent>

        </Dialog>

    );
}
