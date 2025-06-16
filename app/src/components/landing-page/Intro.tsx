import React from "react";

function Intro() {
  const features = [
    {
      title: "One click deploy",
      desc: "Deploy your app in seconds, with our one click deploy feature.",
      image: "/images/git-aws.png", // icon stack
    },
    {
      title: "Hosting over the edge",
      desc: "With our edge network, we host your website by going into each city by ourselves.",
      image: "/images/map-globe.png",
    },
    {
      title: "Intuitive workflow",
      desc: "With our intuitive workflow, you can easily manage your app without complex steps.",
      image: "/images/dashboard-1.png",
    },
    {
      title: "Running out of copy",
      desc: "You are running out of copy for your website, we can generate copy for you.",
      image: "/images/dashboard-2.png",
    },
  ];

  return (
    <section className="py-16 px-4 bg-(--background)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl bg-(--background) shadow-sm p-6 border border-(--border) flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
            <img
              src={f.image}
              alt={f.title}
              className="mt-4 rounded-lg object-cover w-full max-h-48"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Intro;
