import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  image: string;
  tag: string;
}

export function EventCard({ id, title, date, location, participants, image, tag }: EventCardProps) {
  return (
    <div 
      className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow"
      data-testid={`event-card-${id}`}
    >
      <div className="relative h-36 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
          {tag}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{participants}명 참여중</span>
          </div>
        </div>
      </div>
    </div>
  );
}