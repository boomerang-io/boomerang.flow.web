export default [
  {
    creationDate: "2020-05-20T12:12:58.963+0000",
    duration: 54703,
    id: "5ec51eca5a92d80001a2005d",
    initiatedByUserId: "5a0d52e9a1a0b20007f2287a",
    initiatedByUserName: "Iulian Corcoja",
    status: "completed",
    workflowId: "5eb2c4085a92d80001a16d87",
    workflowRevisionid: "5ec2a79d5a92d80001a1f2b1",
    trigger: "manual",
    properties: [
      { key: "tenant.name", value: "acc" },
      { key: "artifactory.username", value: "iulian.corcoja@ro.ibm.com" },
      {
        key: "artifactory.api_key",
        value: "***REMOVED***",
      },
    ],
    steps: [
      {
        activityId: "5ec51eca5a92d80001a2005d",
        duration: 6002,
        flowTaskStatus: "completed",
        id: "5ec51eca5a92d80001a20061",
        order: 1,
        startTime: "2020-05-20T12:13:10.361+0000",
        taskId: "23201b45-6f91-4bc4-9129-37eb3dcc981f",
        taskName: "Download Train Samples",
        outputs: { "": "" },
      },
      {
        activityId: "5ec51eca5a92d80001a2005d",
        duration: 4914,
        flowTaskStatus: "completed",
        id: "5ec51eca5a92d80001a20065",
        order: 2,
        startTime: "2020-05-20T12:13:16.379+0000",
        taskId: "997213d5-f1ec-4fa9-9d95-719fa4db7253",
        taskName: "Download Latest Published Version",
        outputs: { "": "" },
      },
      {
        activityId: "5ec51eca5a92d80001a2005d",
        duration: 9292,
        flowTaskStatus: "failure",
        id: "5ec51eca5a92d80001a20066",
        order: 3,
        startTime: "2020-05-20T12:13:21.331+0000",
        taskId: "5d1f2eaf-790e-456e-b278-cf4a52ea829a",
        taskName: "Check Version File Type",
        outputs: { "#Wed May 20 12:13:29 GMT 2020": "" },
      },
      {
        activityId: "5ec51eca5a92d80001a2005d",
        duration: 10107,
        flowTaskStatus: "completed",
        id: "5ec51eca5a92d80001a20068",
        order: 4,
        startTime: "2020-05-20T12:13:30.643+0000",
        taskId: "62f77206-e48e-4e0d-aeb8-5db0607eeb03",
        taskName: "Create New Version File",
        outputs: { "#Wed May 20 12:13:39 GMT 2020": "" },
      },
      {
        activityId: "5ec51eca5a92d80001a2005d",
        duration: 4145,
        flowTaskStatus: "completed",
        id: "5ec51eca5a92d80001a20069",
        order: 5,
        startTime: "2020-05-20T12:13:40.769+0000",
        taskId: "9f00063f-8235-48e4-b38b-c43361ee8990",
        taskName: "Upload Incremented Version",
        outputs: { "": "" },
      },
      {
        activityId: "5ec51eca5a92d80001a2005d",
        duration: 8680,
        flowTaskStatus: "completed",
        id: "5ec51eca5a92d80001a2006a",
        order: 6,
        startTime: "2020-05-20T12:13:44.935+0000",
        taskId: "0821727a-b336-48ac-b42e-34f7b062dd8c",
        taskName: "Print Persistence Folder",
        outputs: { "#Wed May 20 12:13:52 GMT 2020": "" },
      },
    ],
    teamName: "IBM Automation Control Centre - EU",
  },
];
