import { useEffect, useState } from 'react';
import './JungleVine.css';

interface NavCard {
  id: string;
  title: string;
  color: string;
  link: string;
}

const navCards: NavCard[] = [
  { id: '1', title: 'Gallery', color: '#ff006e', link: '#gallery' },
  { id: '2', title: 'Projects', color: '#8338ec', link: '#projects' },
  { id: '3', title: 'About', color: '#3a86ff', link: '#about' },
  { id: '4', title: 'Contact', color: '#06ffa5', link: '#contact' },
];

export const JungleVine = () => {
  const [vineLength, setVineLength] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    // Animate vine growing
    const growthInterval = setInterval(() => {
      setVineLength((prev) => {
        if (prev >= 100) {
          clearInterval(growthInterval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 20);

    return () => clearInterval(growthInterval);
  }, []);

  useEffect(() => {
    // Reveal cards as vine grows
    const cardThresholds = [25, 45, 65, 85];
    cardThresholds.forEach((threshold, index) => {
      if (vineLength >= threshold && !visibleCards.includes(index)) {
        setVisibleCards((prev) => [...prev, index]);
      }
    });
  }, [vineLength, visibleCards]);

  // Generate SVG path for curving vine
  const generateVinePath = () => {
    const segments: string[] = [];
    const numCurves = 4;
    const heightPerCurve = 100 / numCurves;
    
    segments.push('M 50 0'); // Start at top center
    
    for (let i = 0; i < numCurves; i++) {
      const startY = i * heightPerCurve;
      const endY = (i + 1) * heightPerCurve;
      const midY = startY + heightPerCurve / 2;
      
      // Alternate curve direction
      const curveX = i % 2 === 0 ? 70 : 30;
      
      if ((i + 1) * heightPerCurve <= vineLength) {
        // Full curve
        segments.push(`Q ${curveX} ${midY}, 50 ${endY}`);
      } else if (i * heightPerCurve < vineLength) {
        // Partial curve
        const progress = (vineLength - startY) / heightPerCurve;
        const partialY = startY + (heightPerCurve * progress);
        const partialX = 50 + (curveX - 50) * Math.sin(progress * Math.PI);
        segments.push(`Q ${curveX} ${midY}, ${partialX} ${partialY}`);
        break;
      } else {
        break;
      }
    }
    
    return segments.join(' ');
  };

  // Calculate card positions along vine
  const getCardPosition = (index: number) => {
    const cardPositions = [
      { x: 70, y: 25 },
      { x: 30, y: 45 },
      { x: 70, y: 65 },
      { x: 30, y: 85 },
    ];
    return cardPositions[index];
  };

  return (
    <div className="jungle-vine-container">
      <svg className="vine-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMin slice">
        {/* Vine path */}
        <path
          d={generateVinePath()}
          stroke="url(#vineGradient)"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="vineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06ffa5" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3a86ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8338ec" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Leaves along the vine */}
        {Array.from({ length: Math.floor(vineLength / 10) }).map((_, i) => {
          const y = (i * 10) + 5;
          const x = 50 + (i % 2 === 0 ? 5 : -5);
          return (
            <ellipse
              key={`leaf-${i}`}
              cx={x}
              cy={y}
              rx="2"
              ry="3"
              fill="#06ffa5"
              opacity="0.6"
              transform={`rotate(${i % 2 === 0 ? 45 : -45} ${x} ${y})`}
            />
          );
        })}
      </svg>

      {/* Navigation cards */}
      <div className="nav-cards">
        {navCards.map((card, index) => {
          const position = getCardPosition(index);
          const isVisible = visibleCards.includes(index);
          
          return (
            <a
              key={card.id}
              href={card.link}
              className={`nav-card ${isVisible ? 'visible' : ''}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                borderColor: card.color,
                boxShadow: `0 0 20px ${card.color}40`,
              }}
            >
              <div 
                className="nav-card-glow" 
                style={{ backgroundColor: card.color }}
              />
              <span className="nav-card-title">{card.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
