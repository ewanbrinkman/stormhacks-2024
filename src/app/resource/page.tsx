"use client";

export default function Resource() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <div className="flex flex-grow relative justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Stimulate</h1>
          <p className="mb-6">Check if the person is responsive, can you wake them up?</p>

          <h1 className="text-2xl font-bold mb-4">Airway</h1>
          <p className="mb-6">Make sure there is nothing in the mouth blocking the airway, or stopping the person from breathing. Remove anything that is blocking the airway.</p>

          <h1 className="text-2xl font-bold mb-4">Ventilate</h1>
          <p className="mb-6">Help them breathe. Plug the nose, tilt the head back and give one breath every 5 seconds.</p>

          <h1 className="text-2xl font-bold mb-4">Evaluate</h1>
          <p className="mb-6">Do you see any improvement? Are they breathing on their own? If not, prepare naloxone.</p>

          <h1 className="text-2xl font-bold mb-4">Medicate</h1>
          <p className="mb-6">Inject one dose (1cc) of naloxone into a muscle.</p>

          <h1 className="text-2xl font-bold mb-4">Evaluate and Support</h1>
          <p className="mb-6">
            Evaluate and support. Is the person breathing? Naloxone usually takes effect in 3-5 minutes. If the person is not awake in 5 minutes, give one more 1cc dose of naloxone.
            <br/><br/>
            It's important to stay with the person until they have woken up or emergency services have arrived. If you need to leave the person alone for any reason, place them into the recovery position before you leave to keep the airway clear and to prevent choking. To place somebody in the recovery position:
            <br/><br/>
            <ul className="list-disc list-inside">
              <li>Turn them onto their side.</li>
              <li>Place their bottom hand under their head for support.</li>
              <li>Place their top leg at a 90 degree angle to the body.</li>
            </ul>
          </p>
        </div>
      </div>
    </main>
  );
}
