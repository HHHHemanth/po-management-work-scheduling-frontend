"use client"

import * as React from "react"
import { Award, Rocket, Target, Trophy } from "lucide-react"
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/ui/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TESTIMONIALS = [
  {
    id: "testimonial-3",
    name: "James S.",
    profession: "Frontend Developer",
    rating: 5,
    description:
      "Their innovative solutions and quick turnaround time made our collaboration incredibly successful. Highly recommended!",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "testimonial-1",
    name: "Jessica H.",
    profession: "Web Designer",
    rating: 4.5,
    description:
      "The attention to detail and user experience in their work is exceptional. I'm thoroughly impressed with the final product.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
  },
  {
    id: "testimonial-2",
    name: "Lisa M.",
    profession: "UX Designer",
    rating: 5,
    description:
      "Working with them was a game-changer for our project. Their expertise and professionalism exceeded our expectations.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: "testimonial-4",
    name: "Jane D.",
    profession: "UI/UX Designer",
    rating: 4.5,
    description:
      "The quality of work and communication throughout the project was outstanding. They delivered exactly what we needed.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1922&auto=format&fit=crop",
  },
]

const ANIM_IMAGES = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1936&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2028&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1965&auto=format&fit=crop",
]

function getReviewStarsClass(theme) {
  return theme === "dark" ? "text-primary" : "text-teal-500"
}

function getTextClass(theme) {
  return theme === "dark" ? "text-primary-foreground" : ""
}

function getAvatarClass(theme) {
  return theme === "dark"
    ? "!size-12 border border-stone-700"
    : "!size-12 border border-stone-300"
}

function getCardVariant(theme) {
  return theme === "dark" ? "dark" : "light"
}

function useThemeMode() {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    const root = document.documentElement
    const setFromClass = () => setTheme(root.classList.contains("dark") ? "dark" : "light")

    setFromClass()
    const observer = new MutationObserver(setFromClass)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return theme
}

export function TestimonialsVariant() {
  const theme = useThemeMode()

  return (
    <section className="bg-accent px-8 py-12">
      <div>
        <h3 className="text-center text-4xl font-semibold">Testimonials</h3>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm">
          Teams trust us for reliable delivery, clear communication, and quality output.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[450px] w-[350px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                arrayLength={TESTIMONIALS.length}
                key={testimonial.id}
                variant={getCardVariant(theme)}
                index={index + 2}
                role="article"
                aria-labelledby={`card-${testimonial.id}-title`}
                aria-describedby={`card-${testimonial.id}-content`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars
                    className={getReviewStarsClass(theme)}
                    rating={testimonial.rating}
                  />
                  <div className={`mx-auto w-4/5 text-lg ${getTextClass(theme)}`}>
                    <blockquote cite="#">{testimonial.description}</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className={getAvatarClass(theme)}>
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Portrait of ${testimonial.name}`}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="block text-lg font-semibold tracking-tight md:text-xl">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}

export function AwardsVariant() {
  return (
    <section className="bg-accent px-8 py-12">
      <div>
        <h2 className="text-center text-4xl font-semibold">Recognitions</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm">
          Milestones that reflect design quality, performance, and reliability.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-72 w-[440px]">
            <CardTransformed
              className="items-start justify-evenly border-none bg-blue-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={1}
            >
              <div className="flex flex-col items-start justify-start space-y-4">
                <div className="flex size-16 items-center justify-center rounded-sm bg-secondary/50 text-2xl">
                  <Trophy className="size-8" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">Awwwards</h4>
                  <h3 className="text-2xl font-bold">Site of the Day</h3>
                </div>
              </div>
              <p className="text-secondary/80">
                Consistent usability and visual quality across major screens.
              </p>
            </CardTransformed>

            <CardTransformed
              className="items-start justify-evenly border-none bg-orange-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={2}
            >
              <div className="flex flex-col items-start justify-start space-y-4">
                <div className="flex size-16 items-center justify-center rounded-sm bg-secondary/50 text-2xl">
                  <Rocket className="size-8" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">Performance</h4>
                  <h3 className="text-2xl font-bold">100% Performance Score</h3>
                </div>
              </div>
              <p className="text-secondary/80">
                Optimized interactions and smooth rendering on modern devices.
              </p>
            </CardTransformed>

            <CardTransformed
              className="items-start justify-evenly border-none bg-cyan-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={3}
            >
              <div className="flex flex-col items-start justify-start space-y-4">
                <div className="flex size-16 items-center justify-center rounded-sm bg-secondary/50 text-2xl">
                  <Target className="size-8" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">CSS Awards</h4>
                  <h3 className="text-2xl font-bold">Honorable Mention</h3>
                </div>
              </div>
              <p className="text-secondary/80">
                Interface craft aligned with strong accessibility fundamentals.
              </p>
            </CardTransformed>

            <CardTransformed
              className="items-start justify-evenly border-none bg-violet-600/80 text-secondary backdrop-blur-md"
              arrayLength={TESTIMONIALS.length}
              index={4}
            >
              <div className="flex flex-col items-start justify-start space-y-4">
                <div className="flex size-16 items-center justify-center rounded-sm bg-secondary/50 text-2xl">
                  <Award className="size-8" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wide">Design</h4>
                  <h4 className="text-2xl font-bold">Most Creative Concept</h4>
                </div>
              </div>
              <p className="text-secondary/80">
                Strong visual identity and a differentiated product narrative.
              </p>
            </CardTransformed>
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}

export function ImagesVariant() {
  return (
    <section className="bg-slate-900 px-8 py-12 text-white">
      <div>
        <h2 className="text-center text-4xl font-semibold">Creative Showreel</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-200">
          Image cards stack with perspective transforms while scrolling.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[420px] w-[320px]">
            {ANIM_IMAGES.map((imageUrl, index) => (
              <CardTransformed
                arrayLength={ANIM_IMAGES.length}
                key={index}
                index={index + 2}
                variant="dark"
                className="overflow-hidden !rounded-sm !p-0"
              >
                <img
                  src={imageUrl}
                  alt="Creative visual card"
                  className="size-full object-cover"
                  width="100%"
                  height="100%"
                />
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}
