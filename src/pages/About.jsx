import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, BookOpen, ImageIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/game/Footer';

const imageCredits = [
  // Subatomic to Molecular
  { title: "Length scale of strings (1D) in string theory", credit: "String theory. Shutter Stock (24627319), Royalty Free" },
  { title: "Effective size of neutrinos, the tiniest known piece of matter", credit: "The first observation of a neutrino-induced reaction in a hydrogen bubble chamber. U.S. Department of Energy, Public domain" },
  { title: "Predicted size of preons, building blocks of quarks", credit: "Scalar potential of a point charge. Glenn Decker, Argonne National Lab, CC BY-A-SA 2.0" },
  { title: "Effective size of quarks, building blocks of protons and neutrons", credit: "Standard model of particle physics. Cassiopeia Project, Free Educational Usage" },
  { title: "Compton wavelength of a proton", credit: "Proton detected in an isopropanol cloud chamber, Nuledo, Wikimedia Commons, CC BY-A-SA 4.0" },
  { title: "Diameter of Uranium's nucleus", credit: "Still from Nuclear Physics in 3D, N1ddhog, youtube.com" },
  { title: "Compton wavelength of an electron", credit: "Electron waves of an electron trapped in a corral of iron atoms, Brad Caroll, Weber State University, Public domain" },
  { title: "Bohr radius of hydrogen atom", credit: "Hydrogen atoms under magnification. Stodolna et al. (2013)" },
  { title: "Radius of the largest known atom, cesium, our timekeeper", credit: "Sealed glass ampule, 99.98% Cesium. David Franco, Element Collection" },
  // Molecular to Human
  { title: "Diameter of the DNA helix, our genetic blueprint", credit: "New DNA imaging method unveils Strands At Nanoscale, The Inquisitr" },
  { title: "Diameter of a typical rhinovirus, a common virus in humans", credit: "Molecular surface of the capsid of human rhinovirus 16, Robin S, CC BY-SA 3.0" },
  { title: "Diameter of a human skin cell (keratinocyte)", credit: "Skin cell (keratinocyte) Zeiss Microscopy, CC BY-NC-ND 2.0" },
  { title: "Disk diameter of a typical human red blood cell", credit: "Etheresia Pretorius, Albe C. Swanepoel, University of Pretoria, Ash Image Bank" },
  { title: "Minimum width of a strand of human hair", credit: "Ale Hidalgo, CC0 Public Domain" },
  { title: "Typical diameter of a human ovum", credit: "Human ovum, IVF, light micrograph, Spike Walker, Wellcome Images, CC-BY-CC-ND 2.0 UK" },
  { title: "Typical length of the adult pineal gland", credit: "Pineal gland, thesleuthjournal.com" },
  { title: "Typical diameter of the cornea of an adult eye", credit: "pxsphere.com, CC0 Public Domain" },
  { title: "Typical length of an adult liver", credit: "Human Liver, dliver.com" },
  // Human to Astronomical
  { title: "Floor to celling distance in an average residential home", credit: "Floor to ceiling, pxhere, CC0 Public Domain" },
  { title: "Length of Olympics sized swimming pool", credit: "Swimming Pool, Wikimedia Commons, CC-A 2.0" },
  { title: "Height of the Eiffel Tower (including antenna)", credit: "Tour Eiffel, Benh LIEU SONG, CC BY-SA 3.0" },
  { title: "Length of Three Gorges Dam, the largest dam in the world", credit: "Three Gorges Dam, Wikimedia Commons, CC-A 2.0" },
  { title: "Circumference of Large Hadron Collider, a particle accelerator", credit: "CERN Ariel View, Wikimedia Commons, CC-A 2.0" },
  { title: "Max altitude of the International Space Station from Earth", credit: "STS-116 Spacewalk, Wikimedia Commons, CC-A 2.0" },
  { title: "Length of the Great Wall of China", credit: "The Great Wall of China from 1907, Herbert Ponting, Public Domain" },
  { title: "Length of longest submarine communications cable", credit: "SEA-ME-WE 3, submarinecablemap.com" },
  { title: "Farthest humans have travelled—to the far side of the moon", credit: "Photograph of the dark side of the moon by the crew of Apollo 13. NASA, Public Domain" },
  // Astronomical to Cosmological
  { title: "Diameter of the Sun, our home star", credit: "Solar Dynamics Observatory, NASA, Wikimedia Commons, CC-A 2.0" },
  { title: "Distance from the Earth to the Sun", credit: "Sun, Moon & Earth, Kevin M Gill, CC BY 2.0" },
  { title: "Distance to Voyager 1, the farthest spacecraft from Earth", credit: "IBEX Heliosphere, Wikimedia Commons, CC-A 2.0" },
  { title: "Diameter of the Solar System's Oort Cloud", credit: "L.Calçada, ESO (used with permission)" },
  { title: "Distance to Betelguese, Orion's Red Supergiant", credit: "Orion, Wikimedia Commons, CC-A 2.0" },
  { title: "Diameter of the Milky Way galactic disk", credit: "Milky Way, NASA, Public Domain" },
  { title: "Diameter of our Local Group of galaxies (~54 galaxies)", credit: "The Local Group and Nearby Galaxies, Wikimedia Commons, CC-A 2.0" },
  { title: "Diameter of Laniakea, our local supercluster (~100,000 galaxies)", credit: "Laniakea, Wikimedia Commons, CC-A 2.0" },
  { title: "Co-moving diameter of the observable universe", credit: "The Universe within 14 billion Light Years, Wikimedia Commons, CC-A 2.0" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col font-grotesk">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to game
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold font-mono shimmer-text mb-2">About</h1>
          <p className="text-muted-foreground mb-10">Powers of Ten: Our Universe</p>

          {/* About the game */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">About the Game</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>
                <strong className="text-foreground">Powers of Ten: Our Universe</strong> is an educational card-sorting game that takes players on a journey from the smallest known lengths in physics to the scale of the observable universe.
              </p>
              <p>
                This digital version is based on the original physical card game created by <strong className="text-foreground">Jaya Ramchandani</strong>, published on AstroEDU under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
              </p>
              <p>
                The game helps players learn about powers of ten, orders of magnitude, and the incredible scale of our cosmos — from the Planck length (10⁻³⁵ m) to the co-moving diameter of the observable universe (10²⁶ m).
              </p>
              <a
                href="https://astroedu.iau.org/es/activities/2203/lets-play-with-powers-of-10/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                View original activity on AstroEDU →
              </a>
            </div>
          </section>

          {/* Acknowledgements */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Acknowledgements</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-sm leading-relaxed space-y-3">
              <p className="text-muted-foreground">This game has been created by <strong className="text-foreground">Jaya Ramchandani</strong>.</p>

              <div className="border-l-2 border-accent/40 pl-4 space-y-2">
                <p className="text-foreground font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  Special Thanks
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-primary">Chirag Ramchandani</strong>, Game Designer — for invaluable input on the design and gamification of this experience.
                </p>
              </div>

              <div className="space-y-1 text-muted-foreground">
                <p><strong className="text-foreground">Shermeen Lee</strong>, Secondary Physics Teacher, Yew Chung International School, Shanghai — for input on the content.</p>
                <p><strong className="text-foreground">Abrar Burk</strong> — for design of the first iteration.</p>
                <p>Authors of the Wikipedia article <em>'Orders of magnitude (length)'</em> — for inspiration and information.</p>
                <p>The many students, educators, friends and family for their valuable inputs leading to several iterations.</p>
              </div>

              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                Contact: <a href="https://welearnwegrow.bio/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">welearnwegrow.bio</a>
              </p>
            </div>
          </section>

          {/* Image Credits */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Image Credits</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              To the best of our knowledge, images used belong to the public domain or have a creative commons non-commercial license. Thank you creators!
            </p>
            <div className="bg-card border border-border rounded-xl divide-y divide-border/50">
              {imageCredits.map((item, i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-xs font-semibold text-foreground leading-tight mb-0.5">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{item.credit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* License */}
          <section className="mb-4">
            <div className="bg-secondary/30 border border-border/50 rounded-xl p-5 text-xs text-muted-foreground text-center leading-relaxed">
              <p>
                <em>Powers of Ten: Our Universe</em> has been created by Jaya Ramchandani and is licensed under a{' '}
                <strong className="text-foreground">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</strong>.
              </p>
              <p className="mt-2">We welcome co-branding if you would like to produce copies for commercial use.</p>
            </div>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}