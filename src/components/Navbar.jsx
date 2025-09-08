const Navbar = () => {
  return (
    <nav className="w-full  px-10 py-4 bg-gray-950 text-white flex justify-between items-center shadow-md z-50">
      <h2 className="text-2xl font-bold text-cyan-400">ColdMailX</h2>
      <div className="space-x-4 hidden md:flex">
        <a href="#features" className="hover:text-cyan-300 transition">
          Features
        </a>
        <a href="#pricing" className="hover:text-cyan-300 transition">
          Pricing
        </a>
        <a href="#contact" className="hover:text-cyan-300 transition">
          Contact
        </a>
      </div>
      <div className="space-x-2">
        <a href="/signin" className="text-white hover:text-cyan-300">
          Sign In
        </a>
        <a
          href="/signup"
          className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-xl"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
