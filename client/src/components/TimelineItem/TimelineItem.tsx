import React from 'react';
import './TimelineItem.css';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  description,
  isLeft = true,
}) => {
  return (
    <div className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
      <div className="timeline-content">
        <div className="timeline-year">{year}</div>
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-description">{description}</p>
      </div>
    </div>
  );
};

export default TimelineItem;