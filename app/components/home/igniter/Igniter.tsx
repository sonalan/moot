import React from 'react'

function Igniter() {

  return (
    <>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            {/* Greeting */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-light text-gray-100 mb-2">
                <span className="text-orange-400 mr-3">✱</span>
                Good evening, Sinan
              </h1>
            </div>

            {/* Input Box */}
            <div className="mb-8">
              <div className="relative bg-zinc-800 rounded-3xl border border-zinc-700 overflow-hidden">
                <textarea
                  placeholder="What do you wanna challenge today?"
                  className="w-full bg-transparent px-6 py-5 text-gray-300 placeholder-gray-500 outline-none resize-none min-h-[80px]"
                  rows={1}
                />
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Igniter