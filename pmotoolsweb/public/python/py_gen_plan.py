__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel_plan
import datetime

sum_in_progress = 0
sum_total = 0

def _initMongoConn ():
    connect('leankit')

def _initSponsorsDict ():
    spons_dict = {}
    sponsors = lib.mongoLeankit.Sponsor.objects()
    for i in sponsors:
        spons_dict[i.tag] = i.name + " (" + i.bo_name + ")"
    return spons_dict

def _initReportParams():
    keys = ['report_budget_tolerance', 'report_date_tolerance', 'report_base_rate']

    params_dict = {}
    for i in keys:
        params_dict[i] = 0

    configparams = lib.mongoLeankit.Configparam.objects()
    for i in configparams:
        if i.param_key in keys:
            params_dict[i.param_key] = i.param_value_string

    return params_dict


def writeCollection(collection, excelReport):
    global sum_in_progress
    global sum_total

    last_sponsor = "Not defined"
    sponsor_sum_in_progress = 0
    sponsor_sum_total = 0

    if len(collection) > 0:
        for index, card in enumerate(collection):
            excelReport.writeCard(card)

if __name__ == '__main__':
    sum_in_progress = 0
    sum_total = 0

    _initMongoConn()

    excelReport = lib.excel_plan.ExcelPlanReport(datetime.datetime.now().strftime("Status_%Y-%m-%d-%H-%M-%S.xlsx"),
                         "Agenda planning DreamLab")
    excelReport.initReport(_initSponsorsDict (), _initReportParams())


    # write all cards with set up sponsor
    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='Development backlog')
                                  & Q(workflow_status_name='Next quarter development plan')
                                  & Q(extended_data__sponsor_name__ne ='')).order_by('extended_data__sponsor_name', 'title')
    writeCollection(cards, excelReport)

    # writa all cards without sponsor
    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='Development backlog')
                                  & Q(workflow_status_name='Next quarter development plan')
                                  & Q(extended_data__sponsor_name ='')).order_by('title')
    writeCollection(cards, excelReport)

    data = excelReport.close()

    # print("Report generated, saving to database...")
    report = lib.mongoLeankit.Report()

    report.xls_data = data
    report.generation_date = datetime.datetime.now()
    report.is_plan = True

    report.save()
    exit(0)
    # print("done.")
