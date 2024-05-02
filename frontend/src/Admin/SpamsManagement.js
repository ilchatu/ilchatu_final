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
  useToast // Import useToast hook from Chakra UI
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";

const SpamsManagement = () => {
  const [report, setReport] = useState([]);
  const toast = useToast(); // Initialize toast hook

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

  const handleDelete = async (messageId) => {
    try {
      // Make a PUT request to mark the message as deleted
      const response = await axios.put(`/api/message/${messageId}/mark-as-deleted`);
      // If successful, update the UI or perform any necessary actions
      console.log("Message marked as deleted:", messageId);
      
      // Show toast notification for successful deletion
      toast({
        title: "Success!",
        description: "Message marked as deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error marking message as deleted:", error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  return (
    <div className="main__container1">
      <div className="main__title">
        <div className="main__greeting">
          <h1 className="greeting">Hello Admin</h1>
          <p>Spam and Reports Dashboard</p>
        </div>
      </div>
      {report?.length ? (
        <div className="spam">
          <div className="table-scroll">
            <TableContainer className="spam-table">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date Reported</Th>
                    <Th>Reported Message</Th>
                    <Th>Reported User</Th>
                    <Th>User Email</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {report?.map((item) => (
                    <Tr key={item?._id}>
                      <Td>{moment(item?.createdAt).format("MMM Do YYYY")}</Td>
                      <Td className="reported-message">
                        <div className="reported-message-content">
                          {item?.message}
                        </div>
                      </Td>
                      <Td>{item?.user?.name}</Td>
                      <Td>{item?.user?.email}</Td>
                      <Td>
                        {item.deleted ? (
                          <span>Deleted</span>
                        ) : (
                          <button
                            className="delete-button" // Add CSS class here
                            onClick={() => {
                              console.log("Message ID:", item?.messageId);
                              handleDelete(item?.messageId);
                            }}
                            disabled={item.deleted}
                          >
                            Delete
                          </button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SpamsManagement;
