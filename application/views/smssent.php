
<div class="app-content content">
    <div class="content-overlay"></div>
    <div class="content-wrapper">
        <div class="content-header row">
        </div>
        <div class="content-body">
<?php
            $this->load->library("kendo_ui");

            $transport = new \Kendo\Data\DataSourceTransport();

            $read = new \Kendo\Data\DataSourceTransportRead();

            $read->url('smssent/readdb')
                    ->contentType('application/json')
                    ->type('POST');

            $transport->read($read)
                    ->parameterMap('function(data){return kendo.stringify(data);}');

            $model = new \Kendo\Data\DataSourceSchemaModel();

            $schema = new \Kendo\Data\DataSourceSchema();
            $schema->data('data')
                    ->total('total');


            $dataSortItem = new \Kendo\Data\DataSourceSortItem();
            $dataSortItem->field('receivedTimestamp')
                    ->dir('desc'); //Chu y: Phan biet hoa thuong



            $dataSource = new \Kendo\Data\DataSource();

            $dataSource->transport($transport)
                    ->pageSize(7)
                    ->serverPaging(true)
                    ->serverSorting(true)
                    ->serverFiltering(true)
                    ->addSortItem($dataSortItem)
                    ->schema($schema);

            $grid = new \Kendo\UI\Grid('grid');

            $userFilterable = new \Kendo\UI\GridColumnFilterable();
            $userFilterable->ui(new \Kendo\JavaScriptFunction('userFilter'));

            $userCol = new \Kendo\UI\GridColumn();
            $userCol->field('user')
                    ->width(120)
                    ->filterable($userFilterable)
                    ->title('User');

            $fromFilterable = new \Kendo\UI\GridColumnFilterable();
            $fromFilterable->ui(new \Kendo\JavaScriptFunction('fromFilter'));

            $fromCol = new \Kendo\UI\GridColumn();
            $fromCol->field('from')
                    ->width(120)
                    ->title('From')
                    ->filterable($fromFilterable);

            $toCol = new \Kendo\UI\GridColumn();
            $toCol->field('to')
                    ->width(120)
                    ->title('To');


            $receivedCol = new \Kendo\UI\GridColumn();
            $receivedCol->field('receivedTimestamp')
                    ->width(120)
                    ->template('#:kendo.toString(new Date(receivedTimestamp*1000),"dd/MM/yy HH:mm:ss")#')
                    ->filterable(FALSE)
                    ->title('Received');

            $sentCol = new \Kendo\UI\GridColumn();
            $sentCol->field('sentTimestamp')
                    ->width(120)
                    ->template('#:kendo.toString(new Date(sentTimestamp*1000),"dd/MM/yy HH:mm:ss")#')
                    ->filterable(false)
                    ->title('Sent');


            $textCol = new \Kendo\UI\GridColumn();
            $textCol->field('text')
                    ->filterable(false)
                    ->sortable(false)
                    ->filterable(true)
                    ->title('Text');

            $sortable = new \Kendo\UI\GridSortable();
            $sortable->mode('multiple')
                    ->allowUnsort(true);


            $stringOperators = new \Kendo\UI\GridFilterableOperatorsString();
            $stringOperators
                    ->eq('Is equal to')
                    ->contains('Contains');

            $operators = new \Kendo\UI\GridFilterableOperators();
            $operators->string($stringOperators);

            $filterable = new \Kendo\UI\GridFilterable();
            $filterable->extra(false)
                    ->operators($operators);

            $grid->addColumn($receivedCol, $sentCol, $userCol, $fromCol, $toCol, $textCol)
                    ->dataSource($dataSource)
                    ->scrollable(false)
                    ->sortable($sortable)
                    ->filterable($filterable)
                    ->pageable(true);
            echo $grid->render();
            
            ?>
            
        </div>
    </div>
</div>

<script>
    function userFilter(element) {
        element.kendoDropDownList({
            dataSource: {
                transport: {
                    read: {
                        url: "smssent/readfilter?details=user",
                        type: "POST"
                    }
                },
                schema: {
                    data: "data"
                }
            },
            dataTextField: "user",
            dataValueField: "user",
            optionLabel: "--Select Value--"
        });
    }

    function fromFilter(element) {
        element.kendoDropDownList({
            dataSource: {
                transport: {
                    read: {
                        url: "smssent/readfilter?details=from",
                        type: "POST"
                    }
                },
                schema: {
                    data: "data"
                }
            },
            dataTextField: "from",
            dataValueField: "from",
            optionLabel: "--Select Value--"
        });
    }
</script>
