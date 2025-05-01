import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-3">
      <div className="container text-center">
        <p className="mb-1">© {new Date().getFullYear()} My React App</p>
        <small>Built with arjunchavhan024 ❤️ using React & Bootstrap</small>
      </div>
    </footer>
  );
};

export default Footer;
