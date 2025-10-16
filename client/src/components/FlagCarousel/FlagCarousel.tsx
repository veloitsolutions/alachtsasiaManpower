import './FlagCarousel.css';

const flags = [
  '/flags/Flag_of_Bangladesh.svg',
  '/flags/Flag_of_Burundi.svg',
  '/flags/Flag_of_Ethiopia.svg',
  '/flags/Flag_of_Ghana.svg',
  '/flags/Flag_of_India.svg',
  '/flags/Flag_of_Indonesia.svg',
  '/flags/Flag_of_Kenya.svg',
  '/flags/Flag_of_Sri_Lanka.svg',
  '/flags/Flag_of_the_Philippines.svg',
  '/flags/Flag_of_Uganda.svg',
];

export const FlagCarousel: React.FC = () => {
  return (
    <section className='section flag-carousel-section '>
    <div className="carousel-container container">
      <div className="carousel-track">
        {[...flags, ...flags].map((flag, index) => (
          <img key={index} src={flag} alt={`Flag ${index}`} className="flag" />
        ))}
      </div>
    </div>
    </section>

  );
};
