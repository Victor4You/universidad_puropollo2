// src/components/dashboard/CourseCard.tsx
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CourseCardProps {
  title: string;
  instructor: string;
  image: string;
}

export const CourseCard = ({ title, instructor, image }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-40 w-full">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2 mb-1">{title}</h3>
        <p className="text-xs text-gray-500">{instructor}</p>
      </div>
    </Card>
  );
};