import resolve from "../../utils/resolve";
import { Table } from "../../styles/globalStyles";

const position = resolve.position;

export default function ContestPrize({ config }) {

  console.log(config.referralContestPrizes)
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div>
        <Table style={{ fontSize: '.7rem', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Prize {config.currency}</th>
            </tr>
          </thead>
          <tbody>
            {
              config.referralContestPrizes && config.referralContestPrizes.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>
                      {i + 1}{position(i + 1)}
                    </td>
                    <td>{data}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </div>
  )
}
