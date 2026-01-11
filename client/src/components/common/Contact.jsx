import React from 'react'

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">{t.contact.title}</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex items-center space-x-3">
              <Phone className="w-8 h-8" />
              <span className="text-2xl font-bold">{t.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8" />
              <span className="text-xl">{t.contact.location}</span>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Contact