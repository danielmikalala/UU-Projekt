import React from "react";

export default function AboutPanel() {
  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <div className="space-y-2 text-center sm:text-left ">
        <h2 className="text-xl font-semibold text-black">About</h2>
        <div className="space-y-0.5">
          <p className="font-medium text-gray-500">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            reprehenderit, neque saepe aspernatur consequuntur, sed quae
            doloribus mollitia eius fuga, aliquid accusantium sequi atque
            explicabo nesciunt. Fugit nisi iste rerum!
          </p>
        </div>
      </div>
    </div>
  );
}
