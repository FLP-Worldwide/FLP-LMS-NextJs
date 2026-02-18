import Card from "@/components/admin/students/common/Card";

export default function OverviewTab({ student }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title="Attendance">
          <div className="h-40 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
            Attendance graph (dummy)
          </div>
        </Card>

        <Card title="Calendar">
          <div className="h-32 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
            Calendar (dummy)
          </div>
        </Card>
      </div>

      <div className="space-y-4 p-6">
        <Card title="Birthday">
          <div className="text-xs text-center py-4">
            {student.details?.dob || "Not mentioned"}
          </div>
        </Card>
      </div>
    </div>
  );
}
