import matplotlib.pyplot as plt
import numpy as np

# Results for Firestore and PostgreSQL
firestore_results = {
  "retrieveAllQuery": [
    82.892587,
    116.3243715999999,
    285.79580319999985,
    357.3711323999996,
    562.3112584000003,
    1236.9581835999998
  ],
  "retrieveRecordQuery": [
    32.113392400000066,
    28.682099800000106,
    32.09960560000036,
    34.376704199999224,
    41.00251080000017,
    40.936426000003124
  ],
  "deleteQuery": [
    30.417727399999876,
    31.537140200000067,
    35.3519908000002,
    37.347710200000435,
    39.13463020000054,
    34.152762799998165
  ],
  "addQuery": [
    67.5149292000001,
    67.12402379999985,
    48.82997639999994,
    56.689666199999195,
    60.95526220000029,
    57.93729420000018
  ],
  "updateQuery": [
    58.62498639999994,
    56.42490940000007,
    94.66566040000035,
    44.43082780000041,
    35.64215580000164,
    35.901562799999375
  ],
  "compoundQueryTest": [
    43.38013999999994,
    56.9737978000001,
    91.88412159999935,
    162.64869820000095,
    365.83446540000006,
    412.4448770000032
  ],
  "paginatedQueryTest": [
    50.06574540000001,
    40.015630400000006,
    46.201349199999825,
    42.40323300000091,
    44.7145113999999,
    55.35030700000061
  ]
}

postgres_results = {
  "retrieveAllQuery": [
    13.89682719999999,
    16.659760800000004,
    39.007057200000006,
    69.86828199999998,
    135.76176180000007,
    176.81996560000007
  ],
  "retrieveRecordQuery": [
    1.5416074000000037,
    0.5391935999999987,
    0.9661095999999588,
    0.5735559999999623,
    0.4889216000000488,
    1.1939896000000771
  ],
  "deleteQuery": [
    1.6840708000000064,
    1.549415199999976,
    1.8259895999999571,
    1.736968999999999,
    1.518210199999976,
    1.380230399999982
  ],
  "addQuery": [
    1.8039756000000011,
    1.7882747999999993,
    1.8127891999999974,
    1.5937927999999828,
    1.7625171999999112,
    1.623964799999976
  ],
  "updateQuery": [
    1.5637050000000046,
    1.7365363999999772,
    1.802648199999976,
    1.591152800000009,
    1.594826600000033,
    1.7192431999999827
  ],
  "compoundQueryTest": [
    2.672473799999989,
    5.291112999999996,
    6.002663199999984,
    11.087728800000013,
    29.723709199999938,
    28.967390799999976
  ],
  "paginatedQueryTest": [
    2.029145600000015,
    1.732359400000007,
    1.7132923999999776,
    1.3058623999999326,
    1.3399035999999795,
    1.244415200000094
  ]
}

dataset_sizes = ["1k", "2k", "4k", "8k", "16k", "25k"]  # Dataset labels

# Generate plots for each query type
for query_type in firestore_results.keys():
    firestore_times = firestore_results[query_type]
    postgres_times = postgres_results[query_type]

    x = np.arange(len(dataset_sizes))  # Index for datasets
    width = 0.35  # Bar width

    # Create a new figure
    fig, ax = plt.subplots(figsize=(8, 5))
    bars1 = ax.bar(x - width / 2, firestore_times, width, label="Firestore", color="skyblue")
    bars2 = ax.bar(x + width / 2, postgres_times, width, label="PostgreSQL", color="lightcoral")

    # Add labels and title
    ax.set_title(f"{query_type}", fontsize=14)
    ax.set_xlabel("Dataset Size", fontsize=12)
    ax.set_ylabel("Execution Time (ms)", fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(dataset_sizes, rotation=45)
    ax.legend()

    # Add data labels
    for bar in bars1 + bars2:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2, yval + 0.1, f"{yval:.2f}", ha="center", fontsize=9)

    plt.tight_layout()
    plt.savefig(f"benchmark_{query_type}.png")  # Save the graph as an image
    plt.show()
