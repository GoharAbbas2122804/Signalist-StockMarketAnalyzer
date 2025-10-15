import Image from 'next/image'
import Link from 'next/link'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Meet the Developers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The talented minds behind Signalist, bringing you cutting-edge stock market analysis and AI-powered insights.
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Gohar Abbas - Web Developer */}
          <div className="bg-gray-800 rounded-xl border border-gray-600 p-8 hover:border-yellow-500/50 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500/20 group-hover:border-yellow-500/50 transition-colors duration-300">
                  <Image
                    src="/assets/images/GoharProfiile.png"
                    alt="Gohar Abbas - Web Developer"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Developer Info */}
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Gohar Abbas</h2>
              <p className="text-yellow-500 font-semibold mb-4">Web Developer</p>
              
              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                Passionate full-stack developer with expertise in modern web technologies. 
                Specializing in React, Next.js, and creating seamless user experiences. 
                Dedicated to building scalable applications that make complex data accessible and actionable.
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Portfolio Link */}
              <Link
                href="https://goharabbas.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="yellow-btn px-6 py-3 inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Portfolio
              </Link>
            </div>
          </div>

          {/* Shoaib Akhtar - Data Scientist & AI Model Trainer */}
          <div className="bg-gray-800 rounded-xl border border-gray-600 p-8 hover:border-teal-400/50 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-400/20 group-hover:border-teal-400/50 transition-colors duration-300">
                  <Image
                    src="/assets/images/ShoaibProfile.png"
                    alt="Shoaib Akhtar - Data Scientist & AI Model Trainer"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Developer Info */}
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Shoaib Akhtar</h2>
              <p className="text-teal-400 font-semibold mb-4">Data Scientist & AI Model Trainer</p>
              
              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                Expert in machine learning and artificial intelligence with a focus on financial data analysis. 
                Specializes in developing predictive models and training AI systems for market analysis. 
                Passionate about leveraging data science to unlock insights in the stock market.
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'Machine Learning'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* LinkedIn Link */}
              <Link
                href="https://linkedin.com/in/shoaib-akhtar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="bg-gray-800 rounded-xl border border-gray-600 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">Our Mission</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Together, we're building the future of stock market analysis by combining cutting-edge web development 
              with advanced AI and machine learning. Our goal is to democratize financial insights and make 
              sophisticated market analysis accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
