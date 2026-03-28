import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/baker.jpg"
                alt="Baker preparing desserts"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/20 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
              Our Story
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Made with love, shared with joy
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                What started as a passion for baking in my home kitchen has blossomed 
                into a labor of love that I&apos;m thrilled to share with you. Every dessert 
                I create is made from scratch using recipes passed down through generations 
                and perfected over years of practice.
              </p>
              <p>
                I believe that the best desserts are made with high-quality ingredients, 
                patience, and most importantly, love. Whether it&apos;s a birthday celebration, 
                a holiday gathering, or simply a Tuesday that needs a sweet treat, 
                I pour my heart into every creation.
              </p>
              <p>
                Thank you for letting me be a part of your sweet moments.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-8">
                <div>
                  <p className="font-serif text-3xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Years of Baking</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Unique Recipes</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-bold text-primary">1000+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
