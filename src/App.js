import { useState ,useEffect } from 'react'
import styled from 'styled-components'
import logo from './taipeilogo.png'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`

const PageIntro = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Logo = styled.img`
  width: 80%
`

const PageTitle = styled.div`
  font-size: 20px;
`

const Section = styled.div`
  width: 80%;
  height: 100%;
  background: #f4f4f4;
  padding-top: 20px
`

const SwitchDistrict = styled.div`
  margin-bottom: -30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`

const Select = styled.select`
  height: 30px;
  margin-left: 10px;
  font-size: 18px;
  border-radius: 3px;
  width: 150px;
`
const Option = styled.option``

const Chart = styled.div`
  margin: 40px auto;
  width: 700px;
  height: 480px;
  position: relative;
`

const Line = styled.div`
  border-bottom: 3px solid #e6e6e6;
  margin-bottom: -3px;
  width: 100%;
  height: 60px;
  position: relative;
`

const Interval = styled.div`
  color: #7b7b7b;
  position: absolute;
  left: -30px;
  bottom: -5px;
`

const BarPattern = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: relative;
`

const BarChart = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`

const BarDesc = styled.div`
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 20px;
`

const BarMale = styled.div`
  background: #5e7d9c;
  width: 50px;
  height: ${(props) => props.amount * 3}px;
  margin: 0 10px;
  margin-top: -${(props) => props.amount * 3}px;
  display: flex;
  justify-content: center;
`

const BarFemale = styled(BarMale)`
  background: #f36094;
  height: ${(props) => props.amount * 3}px;
  margin-top: -${(props) => props.amount * 3}px;
`

const Amount = styled.div`
  margin-top: -30px;
`

const SexNoteArea = styled.div`
  position: absolute;
  bottom: -70px;
  width: 150px;
  height: 20px;
  display: flex;
`

const Sex = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`

const SexColor = styled.div`
  width: 30%;
  background: ${(props) => props.sex ? '#5e7d9c' : '#f36094'};
`

const SexDesc = styled.div`
  line-height: 20px
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

  const taipeiDistricts = []
  householdData.map((element) => {
    return taipeiDistricts.push(element.site_id)
  })

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



  let lines = []
  for (let i = 140; i >= 0 ; i-=20) {
    lines.push(
      <Line>
        <Interval>{i}</Interval>
      </Line>
    )
  }

  return (
    <Container>
      <PageIntro>
        <Logo src={logo} />
        <PageTitle>人口戶數及性別</PageTitle>
      </PageIntro>
      <Section>
        <SwitchDistrict>
          地區{' '}
          <Select value={district.name} onChange={handleDistrictChange}>
            {taipeiDistricts.map((district) => (
              <Option key={district} value={district}>
                {district}
              </Option>
            ))}
          </Select>
        </SwitchDistrict>
        <Chart>
          {lines}
          <BarPattern>
            <BarChart>
              <BarMale amount={district.ordinary_male}>
                <Amount>{district.ordinary_male}</Amount>
              </BarMale>
              <BarFemale amount={district.ordinary_female}>
                <Amount>{district.ordinary_female}</Amount>
              </BarFemale>
              <BarDesc>共同生活戶</BarDesc>
            </BarChart>
            <BarChart>
              <BarMale amount={district.single_male}>
                <Amount>{district.single_male}</Amount>
              </BarMale>
              <BarFemale amount={district.single_female}>
                <Amount>{district.single_female}</Amount>
              </BarFemale>
              <BarDesc>單一生活戶</BarDesc>
            </BarChart>
            <SexNoteArea>
              <Sex>
                <SexColor sex></SexColor>
                <SexDesc>男</SexDesc>
              </Sex>
              <Sex>
                <SexColor></SexColor>
                <SexDesc>女</SexDesc>
              </Sex>
            </SexNoteArea>
          </BarPattern>
        </Chart>
      </Section>
    </Container>
  )
}

export default App;
