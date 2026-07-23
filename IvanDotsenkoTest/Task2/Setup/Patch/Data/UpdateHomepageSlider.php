<?php
declare(strict_types=1);

namespace IvanDotsenkoTest\Task2\Setup\Patch\Data;

use Magento\Cms\Model\PageFactory;
use Magento\Cms\Model\ResourceModel\Page as PageResource;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

class UpdateHomepageSlider implements DataPatchInterface
{
    /**
     * @var ModuleDataSetupInterface
     */
    private $moduleDataSetup;

    /**
     * @var PageFactory
     */
    private $pageFactory;

    /**
     * @var PageResource
     */
    private $pageResource;

    /**
     * @param ModuleDataSetupInterface $moduleDataSetup
     * @param PageFactory $pageFactory
     * @param PageResource $pageResource
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        PageFactory $pageFactory,
        PageResource $pageResource
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->pageFactory = $pageFactory;
        $this->pageResource = $pageResource;
    }

    /**
     * @inheritdoc
     */
    public function apply()
    {
        $this->moduleDataSetup->getConnection()->startSetup();

        $page = $this->pageFactory->create();
        $this->pageResource->load($page, 'home', 'identifier');

        if ($page->getId()) {
            $content = $page->getContent();
            if (strpos($content, 'data-content-type="slider"') !== false && strpos($content, 'slider-d-3') === false) {
                $updatedContent = str_replace(
                    'class="pagebuilder-slider"',
                    'class="pagebuilder-slider slider-d-3 slider-t-2 slider-m-1"',
                    $content
                );
                if ($updatedContent !== $content) {
                    $page->setContent($updatedContent);
                    $this->pageResource->save($page);
                }
            }
        }

        $this->moduleDataSetup->getConnection()->endSetup();
    }

    /**
     * @inheritdoc
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public function getAliases()
    {
        return [];
    }
}
