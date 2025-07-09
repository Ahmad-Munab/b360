export const CompanyLogos = () => {
  const companies = ["OUTSCHOOL", "TOPICALS", "upwork", "gifthealth", "ByteDance", "attentive", "aurora"]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {companies.map((company, i) => (
            <div key={i} className="text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
