import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useMobileGestures';
import { ChevronRight, Star } from 'lucide-react';

interface MobileCalculatorCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  isEssential?: boolean;
  className?: string;
}

export function MobileCalculatorCard({
  id,
  title,
  description,
  icon,
  category,
  isEssential = false,
  className
}: MobileCalculatorCardProps) {
  const { lightTap } = useHapticFeedback();

  const handleTouchStart = () => {
    lightTap();
  };

  return (
    <Link href={`/calculadora/${id}`}>
      <Card 
        className={cn(
          "h-full transition-all duration-200 active:scale-95 hover:shadow-lg",
          "border-2 border-transparent hover:border-blue-200",
          "bg-gradient-to-br from-white to-blue-50/30",
          isEssential && "ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-50 to-white",
          className
        )}
        onTouchStart={handleTouchStart}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-3 rounded-xl",
                isEssential 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-gray-100 text-gray-600"
              )}>
                {icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg leading-tight">
                    {title}
                  </CardTitle>
                  {isEssential && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <Badge 
                  variant="outline" 
                  className="mt-1 text-xs bg-white/50"
                >
                  {category}
                </Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}