import Reg_table from "./reg_prov_table/reg_table";
import Prov_table from "./reg_prov_table/prov_table";

const Page_regprov = (props) => {
  let regidvar = (reloadinfo) => {};
  // Data holder and passing to lupon forms
  const onPassregid = (reloadinfo) => {
    regidvar && regidvar(reloadinfo);
  };
  //bridge to pass to lupon form
  const receiveregid = (handler) => {
    regidvar = handler;
  };
  return (
    <div className="container-fluid  me-5 my-3">
      <div className="row">
        <div className="col-6 ">
          <Reg_table onPassregid={onPassregid} />
        </div>
        <div className="col-6 ">
          <Prov_table receiveregid={receiveregid} />
        </div>
      </div>
    </div>
  );
};

export default Page_regprov;
