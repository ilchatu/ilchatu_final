import { useEffect, useState } from "react";
import "./SpamsManagement.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";

const SpamsManagement = () => {
  const [report, setReport] = useState([]);
  useEffect(() => {
    axios
      .get("/api/report")
      .then((res) => {
        setReport(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="main_admin">
      <div className="main__container">
        <div className="main__title">
          <div className="main__greeting">
            <h1>Hello Admin</h1>
            <p>Spam and Reports Dashboard</p>
          </div>
        </div>
        {report?.length ? (
          <div className="spam">
            {/* <ContentList content={admin.spam_posts} /> */}

            <TableContainer
              className="spam-table"  // Add a custom class to the TableContainer
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                padding: "20px",
              }}
            >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date Reported</Th>
                    <Th>Reported Message</Th>
                    <Th>Reported User</Th>
                    <Th>User Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {report?.map((item) => (
                    <Tr key={item?._id}>
                      <Td>{moment(item?.createdAt).format("MMM Do YYYY")}</Td>
                      <Td className="reported-message"> <div className="reported-message-content"> {item?.message} </div></Td>
                      <Td>{item?.user?.name}</Td>
                      <Td>{item?.user?.email}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SpamsManagement;