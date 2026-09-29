import { useEffect } from "react";
import BrandLogo from "../components/BrandLogo";
import FooterBackground from "../components/FooterBackground";

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  return (
    <footer className="studio-footer" aria-label="Footer">
      <FooterBackground />
      <div className="studio-jobs">
        <span className="studio-tag">have a fresh idea?</span>
        <span className="studio-headline studio-job-title">imagination<br />meets craft</span>
        <div className="studio-footer-nav">
          <span>Made</span>
          <span>Story</span>
          <span>In the lab</span>
          <span>Say hey</span>
        </div>
      </div>
      <div className="studio-logo" role="img" aria-label="Studio logo">
        <BrandLogo />
      </div>
      <div className="studio-contact">
        <span className="studio-tag">say hey</span>
        <div className="studio-headline studio-contact-links">
          <span>let’s team up!</span>
          <span>bring us your idea*</span>
        </div>
        <p className="studio-note">*good things start with one spark. let’s make yours.</p>
        <div className="studio-socials">
          <span aria-label="LinkedIn"><img src="/linkedin.svg" alt="" width="35" height="35" /></span>
          <span aria-label="Instagram"><img src="/instagram.svg" alt="" width="35" height="35" /></span>
          <span aria-label="TikTok"><img src="/tiktok.svg" alt="" width="35" height="35" /></span>
        </div>
      </div>
    </footer>
  );
}
