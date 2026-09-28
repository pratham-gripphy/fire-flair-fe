/** A rule-diamond-rule row, used to separate a sheet's editable fields from
 *  its destructive actions. */
export function Divider() {
  return (
    <div className="ff-diamond">
      <span className="rule" />
      <span className="gem" />
      <span className="rule" />
    </div>
  );
}
