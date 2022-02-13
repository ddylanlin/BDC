// import styledComponents from "styled-components";
import { useState ,useEffect } from 'react'
import styled from 'styled-components'

const Select = styled.select`

`

const Option = styled.option`

`

function App() {

  const [householdData, setHouseholdData] = useState([])
  const [district, setDistrict] = useState({
    name: '台北市松山區',
    ordinary_male: 0,
    single_male: 0,
    ordinary_female: 0,
    single_female: 0
  })

  useEffect(() => {
    const result = []
    fetch('https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/106')
      .then((res) => res.json())
      .then((data) => {
        let fetchData = data.responseData
        for (let i = 0; i < fetchData.length; i++) {
          let fetchOrdinaryM = Number(fetchData[i].household_ordinary_m)
          let fetchSingleM = Number(fetchData[i].household_single_m)
          let fetchOrdinaryF = Number(fetchData[i].household_ordinary_f)
          let fetchSingleF = Number(fetchData[i].household_single_f)

          if (fetchData[i].site_id.slice(0, 3) === '臺北市') {
            let include = result.find((element) => {
              return element.site_id === fetchData[i].site_id
            })

            if (include === undefined) {
              result.push({
                site_id: fetchData[i].site_id,
                ordinary_male: fetchOrdinaryM,
                single_male: fetchSingleM,
                ordinary_female: fetchOrdinaryF,
                single_female: fetchSingleF
              })
            } else {
              include.ordinary_male += fetchOrdinaryM
              include.single_male += fetchSingleM
              include.ordinary_female += fetchOrdinaryF
              include.single_female += fetchSingleF
            }
          }
        }
        setHouseholdData(result)
        setDistrict({
          name: result[0].site_id,
          ordinary_male: Math.round(result[0].ordinary_male/1000),
          single_male: Math.round(result[0].single_male/1000),
          ordinary_female: Math.round(result[0].ordinary_female/1000),
          single_female: Math.round(result[0].single_female/1000)
        })
      })
      .catch((err) => console.error(err))
  }, [])

  console.log('householdData', householdData)
  console.log('district', district)
  

  const taipeiDistricts = [
    '臺北市松山區',
    '臺北市信義區',
    '臺北市大安區',
    '臺北市中山區',
    '臺北市中正區',
    '臺北市大同區',
    '臺北市萬華區',
    '臺北市文山區',
    '臺北市南港區',
    '臺北市內湖區',
    '臺北市士林區',
    '臺北市北投區'
  ]

  const handleDistrictChange = (e) => {
    let newDistrict = householdData.find((element) => {
      return element.site_id === e.target.value
    })
    setDistrict({
      name: newDistrict.site_id,
      ordinary_male: Math.round(newDistrict.ordinary_male/1000),
      single_male: Math.round(newDistrict.single_male/1000),
      ordinary_female: Math.round(newDistrict.ordinary_female/1000),
      single_female: Math.round(newDistrict.single_female/1000)
    })
  }

  return (
    <div>
      <Select value={district.name} onChange={handleDistrictChange}>
        {taipeiDistricts.map((district) => (
          <Option key={district} value={district}>
            {district}
          </Option>
        ))}
      </Select>
      <div>選擇的是：{district.name}</div>
      <div>共同生活戶-男：{district.ordinary_male}</div>
      <div>獨立生活戶-男：{district.single_male}</div>
      <div>共同生活戶-女：{district.ordinary_female}</div>
      <div>獨立生活戶-女：{district.single_female}</div>
    </div>
  )
}

export default App;
