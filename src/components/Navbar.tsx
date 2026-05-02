
import { Vote, ChevronRight } from 'lucide-react';

export const Navbar = () => {
  return (
    <header>
      <div className="container flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Vote size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Vote<span className="text-primary">Wise</span></span>
        </div>
        
        <nav className="nav-links hidden md:flex">
          <a href="#lookup">Civic Lookup</a>
          <a href="#roadmap">Process Roadmap</a>
          <a href="#resources">Resources</a>
          <button className="btn btn-primary text-sm">
            Get Started <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
};
